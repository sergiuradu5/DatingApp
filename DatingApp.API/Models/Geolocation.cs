namespace DatingApp.API.Models
{
    public class Geolocation
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public float Latitude { get; set; }
        public float Longitude { get; set; }
    }
}