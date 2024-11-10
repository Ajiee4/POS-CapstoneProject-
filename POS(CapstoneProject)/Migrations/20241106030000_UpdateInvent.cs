using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace POS_CapstoneProject_.Migrations
{
    /// <inheritdoc />
    public partial class UpdateInvent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Remarks",
                table: "InventoryTransactionDetail");

            migrationBuilder.RenameColumn(
                name: "RemainingStock",
                table: "InventoryTransactionDetail",
                newName: "UpdatedQty");

            migrationBuilder.AddColumn<int>(
                name: "QtyOnHand",
                table: "InventoryTransactionDetail",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Remarks",
                table: "InventoryTransaction",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "QtyOnHand",
                table: "InventoryTransactionDetail");

            migrationBuilder.DropColumn(
                name: "Remarks",
                table: "InventoryTransaction");

            migrationBuilder.RenameColumn(
                name: "UpdatedQty",
                table: "InventoryTransactionDetail",
                newName: "RemainingStock");

            migrationBuilder.AddColumn<string>(
                name: "Remarks",
                table: "InventoryTransactionDetail",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
