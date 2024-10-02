using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace POS_CapstoneProject_.Migrations
{
    /// <inheritdoc />
    public partial class UpdateInventoryTransact : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "RequestId",
                table: "InventoryTransaction",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_InventoryTransaction_RequestId",
                table: "InventoryTransaction",
                column: "RequestId");

            migrationBuilder.AddForeignKey(
                name: "FK_InventoryTransaction_Request_RequestId",
                table: "InventoryTransaction",
                column: "RequestId",
                principalTable: "Request",
                principalColumn: "RequestId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InventoryTransaction_Request_RequestId",
                table: "InventoryTransaction");

            migrationBuilder.DropIndex(
                name: "IX_InventoryTransaction_RequestId",
                table: "InventoryTransaction");

            migrationBuilder.DropColumn(
                name: "RequestId",
                table: "InventoryTransaction");
        }
    }
}
