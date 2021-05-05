namespace DatingApp.API.Models
{
    public class Visit
    {
        public int VisitorId { get; set; }
        public int VisitedId { get; set; }
        public virtual User Visitor { get; set; } //One visitor can visit many other profiles
        public virtual User Visited { get; set; } //One profile can be visited by many visitors
    }
}