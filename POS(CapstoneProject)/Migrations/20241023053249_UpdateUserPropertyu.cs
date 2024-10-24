using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace POS_CapstoneProject_.Migrations
{
    /// <inheritdoc />
    public partial class UpdateUserPropertyu : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "isActive",
                table: "User",
                newName: "isArchive");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "isArchive",
                table: "User",
                newName: "isActive");
        }
    }
}
