using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace POS_CapstoneProject_.Migrations
{
    /// <inheritdoc />
    public partial class AddRemaingStockColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "RemainingStock",
                table: "InventoryTransactionDetail",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RemainingStock",
                table: "InventoryTransactionDetail");
        }
    }
}
