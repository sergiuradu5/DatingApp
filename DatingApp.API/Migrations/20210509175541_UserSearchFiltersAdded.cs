using Microsoft.EntityFrameworkCore.Migrations;

namespace DatingApp.API.Migrations
{
    public partial class UserSearchFiltersAdded : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserParams");

            migrationBuilder.CreateTable(
                name: "UserSearchFilters",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserId = table.Column<int>(nullable: false),
                    Gender = table.Column<string>(nullable: true),
                    MinAge = table.Column<int>(nullable: false),
                    MaxAge = table.Column<int>(nullable: false),
                    OrderBy = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserSearchFilters", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserSearchFilters_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserSearchFilters_UserId",
                table: "UserSearchFilters",
                column: "UserId",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserSearchFilters");

            migrationBuilder.CreateTable(
                name: "UserParams",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Gender = table.Column<string>(type: "TEXT", nullable: true),
                    Likees = table.Column<bool>(type: "INTEGER", nullable: false),
                    Likers = table.Column<bool>(type: "INTEGER", nullable: false),
                    MaxAge = table.Column<int>(type: "INTEGER", nullable: false),
                    MinAge = table.Column<int>(type: "INTEGER", nullable: false),
                    OrderBy = table.Column<string>(type: "TEXT", nullable: true),
                    PageNumber = table.Column<int>(type: "INTEGER", nullable: false),
                    PageSize = table.Column<int>(type: "INTEGER", nullable: false),
                    ShowNonVisitedMembers = table.Column<bool>(type: "INTEGER", nullable: false),
                    UserId = table.Column<int>(type: "INTEGER", nullable: false)
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
    }
}
