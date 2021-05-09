using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace DatingApp.API.Migrations
{
    public partial class AddedVisitEntity : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Visits",
                columns: table => new
                {
                    VisitorId = table.Column<int>(nullable: false),
                    VisitedId = table.Column<int>(nullable: false),
                    VisitedDate = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Visits", x => new { x.VisitorId, x.VisitedId });
                    table.ForeignKey(
                        name: "FK_Visits_AspNetUsers_VisitedId",
                        column: x => x.VisitedId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Visits_AspNetUsers_VisitorId",
                        column: x => x.VisitorId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Visits_VisitedId",
                table: "Visits",
                column: "VisitedId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Visits");
        }
    }
}
