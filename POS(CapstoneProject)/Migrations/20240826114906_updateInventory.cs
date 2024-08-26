using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace POS_CapstoneProject_.Migrations
{
    /// <inheritdoc />
    public partial class updateInventory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "InvenotryTransactId",
                table: "InventoryTransaction",
                newName: "InventoryTransactId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "InventoryTransactId",
                table: "InventoryTransaction",
                newName: "InvenotryTransactId");
        }
    }
}
