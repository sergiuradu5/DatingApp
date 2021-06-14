namespace DatingApp.API.DTO
{
    public class UserParamsAndSearchFilterFromQueryDTO
    {
        
    private const int MaxPageSize = 50;
    public int PageNumber { get; set; } = 1;
    private int pageSize = 5;
    public int PageSize
      {
          get { return pageSize; }
          set { pageSize = (value > MaxPageSize) ? MaxPageSize : value; }
      }

      public bool Likees { get; set; } = false;
      public bool Likers { get; set; } = false;
      public bool ShowNonVisitedMembers {get; set; } = false;
      public bool WithDetails { get; set; } = false;
      public bool ShowMatches { get; set; } = false;
      public bool ShowDistance { get; set; } = false;
      public bool DistanceLimit { get; set; } = false;

      
      public int UserId {get; set;}
      public string Gender { get; set; }

      public int MinAge { get; set; } = 18;
      public int MaxAge { get; set; } = 99;

      public string OrderBy { get; set; }
      public int MaxDistance { get; set; } = 200;
    }

}