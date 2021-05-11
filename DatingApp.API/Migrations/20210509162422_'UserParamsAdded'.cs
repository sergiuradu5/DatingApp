using Microsoft.EntityFrameworkCore.Migrations;

namespace DatingApp.API.Migrations
{
    public partial class UserParamsAdded : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "UserParams",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    PageNumber = table.Column<int>(nullable: false),
                    PageSize = table.Column<int>(nullable: false),
                    UserId = table.Column<int>(nullable: false),
                    Gender = table.Column<string>(nullable: true),
                    MinAge = table.Column<int>(nullable: false),
                    MaxAge = table.Column<int>(nullable: false),
                    OrderBy = table.Column<string>(nullable: true),
                    Likees = table.Column<bool>(nullable: false),
                    Likers = table.Column<bool>(nullable: false),
                    ShowNonVisitedMembers = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserParams", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserParams_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserParams_UserId",
                table: "UserParams",
                column: "UserId",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserParams");
        }
    }
}
