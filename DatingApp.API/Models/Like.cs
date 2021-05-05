namespace DatingApp.API.Models
{
    public class Like
    {
        /*There is no Many to Many relationship in this API
        There are only 2 One to Many relationships*/
        public int LikerId { get; set; }
        public int LikeeId { get; set; }
        public virtual User Liker { get; set; } /*One Liker can have many Likees*/
        public virtual User Likee { get; set; } /*One Likee can have many Likers*/
    }
}