using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using DatingApp.API.DTO;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DatingRepository : IDatingRepository {
        private readonly DataContext _context;
        
        public DatingRepository (DataContext context) {
            _context = context;

        }
        public void Add<T> (T entity) where T : class {
            _context.Add(entity);
        }

        public void Delete<T> (T entity) where T : class {
        _context.Remove(entity);
        }

        public async Task<Like> GetLike(int userId, int recipientId)
        {   /*This Method returns the Like if the like between userId & recipientId exists
                if it doesn't, then it returns null*/
            return await _context.Likes
            .FirstOrDefaultAsync(u => u.LikerId == userId && u.LikeeId == recipientId);
        }

        public async Task<Visit> GetVisit(int visitorId, int visitedId) 
        {
          return await _context.Visits
            .FirstOrDefaultAsync(u => u.VisitorId == visitorId && u.VisitedId == visitedId);  
        }

        public async Task<Photo> GetMainPhotoForUser(int userId)
        {
            return await _context.Photos.Where(u => u.UserId == userId).IgnoreQueryFilters()
            .FirstOrDefaultAsync(p => p.IsMain);
        }

        public async Task<Photo> GetPhoto(int id)
        {
            var photo = await _context.Photos.IgnoreQueryFilters().FirstOrDefaultAsync(p => p.Id == id);
            return photo;
        }

        public async Task<PagedList<PhotoForModerationDTO>> GetPhotosForModeration(PhotosForModerationParams photosParams)
        {
             var photos = _context.Photos.IgnoreQueryFilters()
             .Where(p => p.IsApproved == false).OrderBy(p => p.DateAdded)
             .Select(u => new PhotoForModerationDTO {
                 Id = u.Id,
                 UserName = u.User.UserName,
                 Url = u.Url,
                 IsApproved = u.IsApproved,
                 DateAdded = u.DateAdded,
                 IsMain = u.IsMain
             })
             .AsQueryable();

            if(!string.IsNullOrEmpty(photosParams.OrderBy))
            {
                switch (photosParams.OrderBy)
                {
                    case "newest":
                    photos = photos.OrderByDescending(p=> p.DateAdded);
                    break;
                    default:
                    photos = photos.OrderBy(p => p.DateAdded);
                    break;
                }
            }
            
            return await PagedList<PhotoForModerationDTO>.CreateAsync(photos, photosParams.PageNumber, 
            photosParams.PageSize);
        }

        //This method is used to retreive User Data when A User edits his own profile (displaying non-approved photos)
        public async Task<User> GetOwnUser (int id) {
           var user = await _context.Users.IgnoreQueryFilters()
            .FirstOrDefaultAsync(u => u.Id == id);
           return user;
        }
        //Method used when retreiving data about other users (non-approved photos do not get displayed)
         public async Task<User> GetOtherUser (int userToGetId, int userRequesterId = 0) {
           var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userToGetId);
            
            if (userRequesterId != 0) {

            var userLikersForProperty = await GetUserLikes(userRequesterId, true);
            var userLikeesForProperty = await GetUserLikes(userRequesterId, false);
            if (userLikersForProperty.Contains(user.Id)) {
                    user.HasLikedCurrentUser = true;
                    if (userLikeesForProperty.Contains(user.Id)) {
                        user.HasMatchedCurrentUser = true;
                    }
            } else {
                    user.HasLikedCurrentUser = false;
                    user.HasMatchedCurrentUser = false;
                }
            }

           return user;
        }
        /* This Method will be using paging -> instead of retreiving all the data at once
        data is separated / divided into pages */
        public async Task<PagedList<User>> GetUsers(UserParams userParams, UserSearchFilter userSearchFilter) {


            var users = _context.Users.Where(u => u.Id != userParams.UserId)
            .OrderByDescending(u => u.LastActive ).AsQueryable();
            users = users.Where(u => u.Id != userParams.UserId);

            users = users.Where( u => u.Gender == userSearchFilter.Gender);

            if (userParams.ShowNonVisitedMembers)
            {
                
                var visitedMembers = await GetVisitedUsers(userParams.UserId);
                users = users.Where(u => !visitedMembers.Contains(u.Id));
            }

            if(userParams.Likers)
            {
                var userLikers = await GetUserLikes(userParams.UserId, userParams.Likers);
                var userLikees = await GetUserLikes(userParams.UserId, !userParams.Likers);
                users = users.Where(u => userLikers.Contains(u.Id) && !userLikees.Contains(u.Id));
            }

            if(userParams.Likees)
            {
                var userLikees = await GetUserLikes(userParams.UserId, userParams.Likers);
                users = users.Where(u => userLikees.Contains(u.Id));
            }

            if(userSearchFilter.MinAge != 18 || userSearchFilter.MaxAge != 99)
            {
                var minDob = DateTime.Today.AddYears(-userSearchFilter.MaxAge -1 );
                var maxDob = DateTime.Today.AddYears(-userSearchFilter.MinAge);

                users = users.Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <=maxDob);
            }

            var userLikersForProperty = await GetUserLikes(userParams.UserId, true);
            var userLikeesForProperty = await GetUserLikes(userParams.UserId, false);                  
            List<int> usersWithinDistance = new List<int>();
        
            foreach (var user in users) {
                if (userParams.ShowDistance) {
                    var distance = await CalculateDistance(userParams.UserId, user.Id);
                    

                    if ((userParams.DistanceLimit==true) && (distance <= userSearchFilter.MaxDistance)) {
                        usersWithinDistance.Add(user.Id);
                    }
                    user.DistanceFromCurrentUser = Math.Truncate(distance);
                }

                if (userLikersForProperty.Contains(user.Id)) {
                    user.HasLikedCurrentUser = true;
                    if (userLikeesForProperty.Contains(user.Id)) {
                        user.HasMatchedCurrentUser = true;
                    }
                } else {
                    user.HasLikedCurrentUser = false;
                    user.HasMatchedCurrentUser = false;
                }

            }

            if(userParams.DistanceLimit) {
            users = users.Where(u => usersWithinDistance.Contains(u.Id));
           
            }


            if (userParams.ShowMatches) {
                users = users.Where(u => userLikersForProperty.Contains(u.Id) && userLikeesForProperty.Contains(u.Id));
            }

            if(!string.IsNullOrEmpty(userSearchFilter.OrderBy))
            {
                switch (userSearchFilter.OrderBy)
                {
                    case "created":
                    users = users.OrderByDescending(u=> u.Created);
                    break;
                    default:
                    users = users.OrderByDescending(u => u.LastActive);
                    break;
                }
            }

            return await PagedList<User>.CreateAsync(users, userParams.PageNumber, 
            userParams.PageSize);
        }

        public async Task<PagedList<User>> GetUsers(UserParams userParams) {
            
            var userSearchFilter = await GetUserSearchFilter(userParams.UserId);
            var users = _context.Users.Where(u => u.Id != userParams.UserId)
            .OrderByDescending(u => u.LastActive ).AsQueryable();
            users = users.Where(u => u.Id != userParams.UserId);

            users = users.Where( u => u.Gender == userSearchFilter.Gender);

            

            if (userParams.ShowNonVisitedMembers)
            {
                var visitedMembers = await GetVisitedUsers(userParams.UserId);
                users = users.Where(u => !visitedMembers.Contains(u.Id));
            }
            

            if(userParams.Likers)
            {
                
                var userLikers = await GetUserLikes(userParams.UserId, userParams.Likers);
                var userLikees = await GetUserLikes(userParams.UserId, !userParams.Likers);
               
                users = users.Where(u => userLikers.Contains(u.Id) && !userLikees.Contains(u.Id));
            }
           

            var userLikersForProperty = await GetUserLikes(userParams.UserId, true);
            var userLikeesForProperty = await GetUserLikes(userParams.UserId, false);

            foreach (var user in users) {
                if (userParams.ShowDistance) {
                    var distance = await CalculateDistance(userParams.UserId, user.Id);
                    user.DistanceFromCurrentUser = Math.Truncate(distance);
                }

                if (userLikersForProperty.Contains(user.Id)) {
                    user.HasLikedCurrentUser = true;
                    if (userLikeesForProperty.Contains(user.Id)) {
                        user.HasMatchedCurrentUser = true;
                    }
                } else {
                    user.HasLikedCurrentUser = false;
                    user.HasMatchedCurrentUser = false;
                }
            }
            

            if (userParams.ShowMatches) {
                users = users.Where(u => userLikersForProperty.Contains(u.Id) && userLikeesForProperty.Contains(u.Id));
            }

            return await PagedList<User>.CreateAsync(users, userParams.PageNumber, 
            userParams.PageSize);
        }

        //Private method for calculating the distance between two coordinate points
        public async Task<double> CalculateDistance (int userRequesterId, int userRequestedId) {
            Geolocation geoloc1;
            Geolocation geoloc2;
            geoloc2 = await GetGeolocation(userRequestedId);
            geoloc1 = await GetGeolocation(userRequesterId);
            var p = 0.017453292519943295; 
            var a = 0.5 - Math.Cos( (geoloc2.Latitude - geoloc1.Latitude) * p) /2 +
                        Math.Cos(geoloc1.Latitude * p ) * Math.Cos(geoloc2.Latitude * p) *
                        (1 - Math.Cos((geoloc2.Longitude - geoloc1.Longitude) *p))/2;
            return 12742 * Math.Asin(Math.Sqrt(a));
        }


        
        //Getting the UserSearchFilter of the user from the database via the User Id
        public async Task<UserSearchFilter> GetUserSearchFilter(int id) {
            var userSearchFilter = await _context.UserSearchFilters.FirstOrDefaultAsync(u => u.UserId == id);
            
           return userSearchFilter;
        }

        //Private method for returning the Likers or Likees
        private async Task<IEnumerable<int>> GetUserLikes(int id, bool likers)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id );

            if (likers)
            {
                /* Select makes the Where() return the IEnumerable collection of user ID and not the whole collection of  Users */
                return user.Likers.Where(u => u.LikeeId == id).Select(i => i.LikerId);
            }
            else 
            {
                return user.Likees.Where(u=> u.LikerId == id).Select(i => i.LikeeId);
            }
        }

        //Private method for returning the visited users
        private async Task<IEnumerable<int>> GetVisitedUsers(int id)
        {
            var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == id );
            
            return user.Visitees.Where(u => u.VisitorId ==id).Select(i => i.VisitedId);
        }

        public async Task<bool> SaveAll () {
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<Message> GetMessage(int id)
        {
             return await _context.Messages.FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams)
        {
            var messages = _context.Messages
            .AsQueryable(); /*When you add a Where() method, it has to be Queryable*/

            switch (messageParams.MessageContainer)
            {
                case "Inbox":
                    messages = messages.Where(u => u.RecipientId == messageParams.UserId 
                        && u.RecipientDeleted == false);
                    break;
                case "Outbox":
                    messages = messages.Where(u => u.SenderId == messageParams.UserId
                        && u.SenderDeleted == false);
                    break;
                default:
                    messages = messages.Where(u=>u.RecipientId == messageParams.UserId 
                        && u.RecipientDeleted == false && u.IsRead==false);
                    break;
            }
            messages = messages.OrderByDescending(d => d.MessageSent);

            return await PagedList<Message>
            .CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId)
        {
            var messages = await _context.Messages
                .Where(m => m.RecipientId == userId && m.RecipientDeleted == false && m.SenderId == recipientId 
                || m.RecipientId == recipientId && m.SenderDeleted == false && m.SenderId == userId)
                .OrderByDescending(m => m.MessageSent)
                .ToListAsync();

                return messages;
        }

        //Public method for returning the last geolocation information
        public async Task<Geolocation> GetGeolocation (int userId) {
            var geolocation = await _context.Geolocations.FirstOrDefaultAsync(u => u.UserId == userId );
            
            return geolocation;

        }
    }
}