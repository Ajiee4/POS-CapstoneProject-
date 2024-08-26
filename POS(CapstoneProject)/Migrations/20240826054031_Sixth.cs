using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace POS_CapstoneProject_.Migrations
{
    /// <inheritdoc />
    public partial class Sixth : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Brand",
                table: "Ingredient");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Brand",
                table: "Ingredient",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
