namespace DatingApp.API.DTO
{
    public class UserSearchFilterForReturnDTO
    {

      public int UserId {get; set;}
      public string Gender { get; set; }

      public int MinAge { get; set; } = 18;
      public int MaxAge { get; set; } = 99;

      public string OrderBy { get; set; }

      public int MaxDistance {get; set; } = 200;
      
    }
}