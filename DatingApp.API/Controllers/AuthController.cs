using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.DTO;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DatingApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class AuthController: ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IDatingRepository _repo;

        public AuthController(IConfiguration config, IMapper mapper,
         UserManager<User> userManager, SignInManager<User> signInManager, IDatingRepository repo)
        {
            
            _config=config;
            _mapper = mapper;
            _userManager = userManager;
            _signInManager = signInManager;
            _repo = repo;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register (UserForRegisterDTO userForRegisterDTO)
        {
         
            userForRegisterDTO.KnownAs = char.ToUpper(userForRegisterDTO.KnownAs[0]) + userForRegisterDTO.KnownAs.Substring(1).ToLower();
            userForRegisterDTO.City = char.ToUpper(userForRegisterDTO.City[0]) + userForRegisterDTO.City.Substring(1).ToLower();
            userForRegisterDTO.Country = char.ToUpper(userForRegisterDTO.Country[0]) + userForRegisterDTO.Country.Substring(1).ToLower();

            var userToCreate = _mapper.Map<User>(userForRegisterDTO);
            
            var result = await _userManager.CreateAsync(userToCreate, userForRegisterDTO.Password);
            result = await _userManager.AddToRoleAsync(userToCreate, "Member");
            var userToReturn = _mapper.Map<UserForDetailedDTO>(userToCreate);
            String gender = "";
            if (userToCreate.Gender == "male") {
                gender = "female";
            }
            if (userToCreate.Gender == "female") {
                gender = "male";
            }
            if (userToCreate.Gender == "other") {
                gender = "other";
            }

            var defaultUserSearchFilter = new UserSearchFilter{
            
                UserId = userToCreate.Id,
                Gender = gender,
                MinAge = 18,
                MaxAge = 99,
                OrderBy = "lastActive",
                MaxDistance = 200
            };

            var geolocation = new Geolocation {
                UserId = userToCreate.Id,
                Latitude = userToCreate.LastSavedGeolocation.Latitude,
                Longitude = userToCreate.LastSavedGeolocation.Longitude
            };

            if(result.Succeeded)
            {
                _repo.Add<UserSearchFilter>(defaultUserSearchFilter); //Adding the newly created search filter to our repo
                _repo.Add<Geolocation>(geolocation); //Adding the newly created geolocation
                if(await _repo.SaveAll()) {
                  return CreatedAtRoute("GetOwnUser", new { controller = "Users", id = userToCreate.Id}, userToReturn );
                }
            }
            return BadRequest(result.Errors);

          
            /* CreatedAtRoute returns an "address" where we could find the newly created object in the future */
            
            /* "GetUser" is the name of the HTTPGET request, the next is the controller that contains that methon,
                and the last is the object in itself, but we do not want to send the user with the password all together */
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDTO userForLoginDTO)
        {
            var user = await _userManager.FindByNameAsync(userForLoginDTO.Username);
            if(user == null)
            {
                return Unauthorized();
            }
            var result = await _signInManager.CheckPasswordSignInAsync(user,
            userForLoginDTO.Password, false);

            var userSearchFilter = await _repo.GetUserSearchFilter(user.Id);
            var userSearchFilterForReturn = _mapper.Map<UserSearchFilterForReturnDTO>(userSearchFilter);
           
            if (result.Succeeded)
            {
                 var appUser = await _userManager.Users.Include(p => p.Photos)
                    .FirstOrDefaultAsync(u => u.NormalizedUserName == userForLoginDTO.Username.ToUpper());
                    var userToReturn = _mapper.Map<UserForListDTO>(appUser);
                 return Ok(new {
                token= GenerateJwtToken(appUser).Result,
                user = userToReturn,
                searchFilter = userSearchFilterForReturn
            });
            }
            return Unauthorized();
        }

        private async Task<string> GenerateJwtToken(User user)
        {
             var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName)

            };

            var roles = await _userManager.GetRolesAsync(user);

            foreach(var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8
            .GetBytes(_config.GetSection("AppSettings:Token").Value));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = System.DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}