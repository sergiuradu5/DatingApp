using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;
using DatingApp.API.Helpers;
using System.ComponentModel.DataAnnotations.Schema;
using AutoMapper.Configuration.Annotations;

namespace DatingApp.API.Models
{
    public class User : IdentityUser<int> /*Using int for ID */
    {
       
        public string Gender { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string KnownAs { get; set; }
        public DateTime Created {get; set; }
        public DateTime LastActive { get; set; }
        public string Introduction { get; set; }
        public string   LookingFor {get; set; }
        public string  Interests { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        //Property that hold whether the member the current user is looking at has already liked the user
        [NotMapped]
        public bool HasLikedCurrentUser {get; set; } = false;
        [NotMapped]
        public bool HasMatchedCurrentUser {get; set; } = false;
        public virtual ICollection<Photo> Photos { get; set; }

        public virtual ICollection<Like> Likers{ get; set; }
        public virtual ICollection<Like> Likees { get; set; }
        ////////////////////////////////
        public virtual ICollection<Visit> Visitors{ get; set; }
        public virtual ICollection<Visit> Visitees{ get; set; }
        public virtual ICollection<Message> MessagesSent { get; set; }
        public virtual ICollection<Message> MessagesReceived { get; set; }

        public virtual ICollection<UserRole> UserRoles { get; set; }
        //Storing User Params inside the Database
        public virtual UserSearchFilter UserParams { get; set; }

    }
}