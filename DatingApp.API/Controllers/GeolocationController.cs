using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace DatingApp.API.Controllers
{
  //  [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class GeolocationController : ControllerBase
    {
        
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;

        public GeolocationController(IDatingRepository repo,
        IMapper mapper)
        {
            _repo = repo;
            _mapper = mapper;

        }
        
        [HttpPost("{id}")]
        public async Task<IActionResult> UpdateGeolocation(int id, [FromBody]GeolocationForUpdateDTO geolocationForUpdate) 
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
            return Unauthorized();
            
        var geolocationFromRepo = await _repo.GetGeolocation(id);
            _mapper.Map(geolocationForUpdate, geolocationFromRepo);
        
        if(await _repo.SaveAll())
            {
            return Ok();
            }

           return NoContent();
        }

        
        // [HttpGet("{userId}")]
        // public async Task<IActionResult> GetGeolocation(int userId)
        // {
        //      var geolocationFromRepo = await _repo.GetGeolocation(userId)

        //     var photo = _mapper.Map<PhotoForReturnDTO>(photoFromRepo);

        //     return Ok(photo);  
        // }
    }
}
