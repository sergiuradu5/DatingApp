using System.ComponentModel.DataAnnotations;
using System;
using DatingApp.API.Models;

namespace DatingApp.API.DTO
{
    public class UserForRegisterDTO
    {
        [Required]
        public string Username { get; set; }
        [Required]
        [StringLength(20, MinimumLength = 4, ErrorMessage = "You must specify a password between 4 and 20 characters")]
        public string Password { get; set; }

        [Required]
        public string Gender { get; set; }
        [Required]
        public string KnownAs { get; set; }
        [Required]
        public DateTime DateOfBirth { get; set; }
        [Required]
        public string City { get; set; }
        [Required]
        public string Country { get; set; }

        public DateTime Created { get; set; }

        public DateTime LastActive { get; set; }

        public GeolocationForRegisterDTO LastSavedGeolocation {get; set; }
        
        public UserForRegisterDTO()
        {
            Created = DateTime.Now;
            LastActive = DateTime.Now;
        }
    }
}