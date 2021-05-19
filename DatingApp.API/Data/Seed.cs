using System;
using System.Collections.Generic;
using System.Linq;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;

namespace DatingApp.API.Data
{
    public class Seed
    {
        public static void SeedUsers(UserManager<User> userManager, RoleManager<Role> roleManager, DataContext context)
        {
            if (!userManager.Users.Any())
            {
                var userData = System.IO.File.ReadAllText("Data/UserSeedDataExtended.json");
                var users = JsonConvert.DeserializeObject<List<User>>(userData);

                //create some roles
                var roles = new List<Role>
                {
                    new Role{ Name = "Member" },
                    new Role{ Name = "Admin" },
                    new Role{ Name = "Moderator" },
                    new Role{ Name = "VIP" }
                };

                foreach (var role in roles)
                {
                     roleManager.CreateAsync(role).Wait();
                     //To make an async method syncronous, just add Wait()
                }
                String gender = "";


                foreach(var user in users)
                {
                    user.Photos.SingleOrDefault().IsApproved = true;
                    userManager.CreateAsync(user, "password").Wait();
                    userManager.AddToRoleAsync(user, "Member");

                    if (user.Gender == "male") {
                    gender = "female";
                    }
                    if (user.Gender == "female") {
                        gender = "male";
                    }
                    if (user.Gender == "other") {
                        gender = "other";
                    }

                    var defaultUserSearchFilter = new UserSearchFilter{
                    
                        UserId = user.Id,
                        Gender = gender,
                        MinAge = 18,
                        MaxAge = 99,
                        OrderBy = "lastActive"
                    };
                    
                    var geolocation = new Geolocation {
                        UserId = user.Id
                    };

                    Microsoft.EntityFrameworkCore.ChangeTracking.EntityEntry<UserSearchFilter> entityEntry = context.UserSearchFilters.Add(defaultUserSearchFilter);
                    Microsoft.EntityFrameworkCore.ChangeTracking.EntityEntry<Geolocation> entityEntry2 = context.Geolocations.Add(geolocation);
                 }
                context.SaveChanges();
                
                // create admin user
                var adminUser = new User
                {
                    UserName = "Admin"
                };
                var result = userManager.CreateAsync(adminUser, "password").Result;

                if (result.Succeeded)
                {
                    var admin = userManager.FindByNameAsync("Admin").Result;
                    userManager.AddToRolesAsync(admin, new[] {"Admin", "Moderator"});
                }
            }
        }
        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
      {
          using (var hmac = new System.Security.Cryptography.HMACSHA512())
          {
              passwordSalt = hmac.Key;
              passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
          }  
          
      }   
    }
}