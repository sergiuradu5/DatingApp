using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;
using System;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace DatingApp.API.Data

{
    public class DataContext : IdentityDbContext<User, Role, int,
    IdentityUserClaim<int>,  UserRole, IdentityUserLogin<int>, IdentityRoleClaim<int>, 
    IdentityUserToken<int>>
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) {}
        public DbSet<Value> Values {get; set;}
        
        public DbSet<Photo> Photos {get; set; }

        public DbSet<Like> Likes { get; set; }

        public DbSet<Visit> Visits {get; set; }

        public DbSet<Message> Messages { get; set; }

        public DbSet<UserSearchFilter> UserSearchFilters {get; set; }
        public DbSet<Geolocation> Geolocations {get; set; }

        /*Overriding a function*/
        protected override void OnModelCreating(ModelBuilder builder)
        {/*With this OnModelCreating function we create our own tables*/
        /*Likes table and Messages table is more of a Look up table with One To Many Relationship*/
            base.OnModelCreating(builder);


            /*Adding a Global Query Filter and will remove it when not needed */
            builder.Entity<Photo>().HasQueryFilter(p => p.IsApproved == true);

            builder.Entity<UserRole>(userRole => 
            {
                userRole.HasKey(ur => new {ur.UserId, ur.RoleId});

                userRole.HasOne(ur => ur.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.RoleId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();

                userRole.HasOne(ur => ur.User)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.UserId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();
                
            });
            
            builder.Entity<Like>()
            .HasKey(k => new {k.LikerId, k.LikeeId });

            builder.Entity<Like>()
            .HasOne(u => u.Likee)
            .WithMany(u => u.Likers)
            .HasForeignKey(u => u.LikeeId )
            .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Like>()
            .HasOne(u => u.Liker)
            .WithMany(u => u.Likees)
            .HasForeignKey(u => u.LikerId )
            .OnDelete(DeleteBehavior.Restrict);
            
            //Visiting Done in Entity Framework
            ////////////////////////////////////////////////////////////////

            builder.Entity<Visit>()
            .HasKey(k => new {k.VisitorId, k.VisitedId });

            builder.Entity<Visit>()
            .HasOne(u => u.Visited)
            .WithMany(u => u.Visitors)
            .HasForeignKey(u => u.VisitedId )
            .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Visit>()
            .HasOne(u => u.Visitor)
            .WithMany(u => u.Visitees)
            .HasForeignKey(u => u.VisitorId )
            .OnDelete(DeleteBehavior.Restrict);
            ////////////////////////////////////////////////////////////////

            builder.Entity<Message>()
            .HasOne(u => u.Sender)
            .WithMany(m => m.MessagesSent)
            .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Message>()
            .HasOne(u => u.Recipient)
            .WithMany(m => m.MessagesReceived)
            .OnDelete(DeleteBehavior.Restrict);
            //Limiting the length of the Properties in order to make them work for MySql

            


             builder.Entity<User>(entity => { 
 	entity.Property(m => m.Email).HasMaxLength(85); 
 	entity.Property(m => m.NormalizedEmail).HasMaxLength(85); 
 	entity.Property(m => m.NormalizedUserName).HasMaxLength(85); 
 	entity.Property(m => m.UserName).HasMaxLength(85); 
    
    }); 
    builder.Entity<Role>(entity => { 
        entity.Property(m => m.Name).HasMaxLength(85); 
        entity.Property(m => m.NormalizedName).HasMaxLength(85); 
    }); 
    builder.Entity<IdentityUserLogin<int>>(entity => 
    { 
       
        entity.Property(m => m.ProviderKey).HasMaxLength(85); 
        entity.Property(m => m.ProviderDisplayName).HasMaxLength(85); 
        entity.Property(m => m.LoginProvider).HasMaxLength(85); 
    }); 

    
    builder.Entity<UserRole>(entity =>
    { 
        entity.Property(m => m.UserId).HasMaxLength(85); 
        entity.Property(m => m.RoleId).HasMaxLength(85); 
    }); 
    builder.Entity<IdentityUserToken<int>>(entity =>
    { 
        entity.Property(m => m.UserId).HasMaxLength(85); 
        entity.Property(m => m.LoginProvider).HasMaxLength(85); 
        entity.Property(m => m.Name).HasMaxLength(85); 
    }); 
    builder.Entity<IdentityUserClaim<int>>(entity => 
    { 
        entity.Property(m => m.UserId).HasMaxLength(85); 
        
    }); 

        }
    }
}