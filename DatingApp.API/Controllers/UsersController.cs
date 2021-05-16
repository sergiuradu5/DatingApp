using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using DatingApp.API.Helpers;
using System;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Identity;

namespace DatingApp.API.Controllers {
    [ServiceFilter(typeof(LogUserActivity))]
    //[Authorize]
    [Route ("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;
        public UsersController (IDatingRepository repo, IMapper mapper, UserManager<User> userManager) {
            _mapper = mapper;
            _repo = repo;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers ([FromQuery]UserParamsAndSearchFilterFromQueryDTO userParamsAndSearchFilterFromQuery) {
            
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var userFromRepo = await _repo.GetOtherUser(currentUserId);
            var userParams = _mapper.Map<UserParams>(userParamsAndSearchFilterFromQuery);
            var userSearchFilter = await _repo.GetUserSearchFilter(currentUserId);

            if(string.IsNullOrEmpty(userParamsAndSearchFilterFromQuery.Gender))
            {
                // if(userSearchFilter.Gender == "male")
                // userSearchFilter.Gender = "female";

                // if(userSearchFilter.Gender == "female")
                // userSearchFilter.Gender = "male";

                // if(userSearchFilter.Gender == "other")
                // userSearchFilter.Gender = "other";

                userSearchFilter.MinAge = 18;
                userSearchFilter.MaxAge = 99;
                userSearchFilter.OrderBy = "lastActive";
            }

            var users = await _repo.GetUsers(userParams, userSearchFilter);
            var usersToReturn = _mapper.Map<IEnumerable<UserForListDTO>>(users);

            Response.AddPagination(users.CurrentPage, users.PageSize, 
                users.TotalCount, users.TotalPages);

            if (userParamsAndSearchFilterFromQuery.WithDetails)
            {
                var usersToReturnDetailed = _mapper.Map<IEnumerable<UserForDetailedDTO>>(users);
                return Ok(usersToReturnDetailed);
            }
            
            return Ok (usersToReturn);
        }

        [HttpGet("{id}", Name = "GetUser")]
        public async Task<IActionResult> GetUser (int id) {
            User user;
            if (id == int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                 user = await _repo.GetOwnUser(id);
            }
            else
            {
                user = await _repo.GetOtherUser(id);
            }
            
            var userToReturn = _mapper.Map<UserForDetailedDTO>(user);
            return Ok (userToReturn);
        }

        [HttpGet("{id}/searchFilter", Name = "GetUserSearchFilter")]
        public async Task<IActionResult> GetUserSearchFilter(int id) {
            UserSearchFilter userSearchFilter;
            if (id == int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            {
                 userSearchFilter = await _repo.GetUserSearchFilter(id);
            }
            else
            {
                return Unauthorized();
            }
            
            var userSearchFilterToReturn = _mapper.Map<UserSearchFilterForReturnDTO>(userSearchFilter);
            return Ok (userSearchFilterToReturn);
        }

        [HttpPut("{id}/searchFilter", Name = "UpdateUserSearchFilter")]
        public async Task<IActionResult> UpdateUserSearchFilter(int id, [FromBody]UserSearchFilterForUpdateDTO userSearchFilterForUpdate)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            return Unauthorized();

            var userSearchFilterFromRepo = await _repo.GetUserSearchFilter(id);
            _mapper.Map(userSearchFilterForUpdate, userSearchFilterFromRepo);

            if(await _repo.SaveAll())
            {
            return Ok(userSearchFilterForUpdate);
            }

            throw new Exception($"Updating user search filter with id {id} failed on save");
        }



        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserForUpdateDTO userForUpdateDto)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            return Unauthorized();

            var userFromRepo = await _repo.GetOwnUser(id);
            _mapper.Map(userForUpdateDto, userFromRepo);

            // User user;
            // UserForDetailedDTO userToReturn;

            if(await _repo.SaveAll())
            {
               var user = await _repo.GetOwnUser(id);
               var userToReturn = _mapper.Map<UserForDetailedDTO>(user);
                return Ok(userToReturn);
            }

            throw new Exception($"Updating user {id} failed on save");
        }

        [HttpPost("{id}/like/{recipientId}")]
        public async Task<IActionResult> LikeUser(int id, int recipientId)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            return Unauthorized();

            var like = await _repo.GetLike(id, recipientId);

            if (like != null)
                return BadRequest("You already like this user");

            if (await _repo.GetOtherUser(recipientId) == null)
                return NotFound();

            like = new Like     //If the like doesn't exist already, this part creates a new like
            {
                LikerId = id,
                LikeeId = recipientId

            };
            _repo.Add<Like>(like); //Adding the newly created like to our repo

            if (await _repo.SaveAll())
                return Ok();
            
            return BadRequest( "Failed to like user");
        }

        [HttpPost("{id}/visit/{visitedId}")]
        public async Task<IActionResult> VisitUser(int id, int visitedId)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            return Unauthorized();

            var visit = await _repo.GetVisit(id, visitedId);

             if (visit != null)
                return BadRequest("You already visited this user");

            if (await _repo.GetOtherUser(visitedId) == null)
                return NotFound();

             visit = new Visit     //If the like doesn't exist already, this part creates a new like
            {
                VisitorId = id,
                VisitedId = visitedId,
                VisitedDate = DateTime.Now

            };
            _repo.Add<Visit>(visit); //Adding the newly created like to our repo

            if (await _repo.SaveAll())
                return Ok();
            
            return BadRequest( "Failed to visit user");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id) 
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            return Unauthorized();

            var userFromRepo = await _repo.GetOwnUser(id);
            
            _repo.Delete(userFromRepo);

            if (await _repo.SaveAll()) {
                return Ok();
            }
            
            return BadRequest( "Failed to delete user");

        }


    }
}