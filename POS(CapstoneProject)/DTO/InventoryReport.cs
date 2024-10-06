namespace POS_CapstoneProject_.DTO
{
    public class InventoryReport
    {
        public string Name { get; set; }

        public DateTime TransactionDate { get; set; }
        public string TransactionType { get; set; }
        public int TotalQuantity { get; set; }

    }
}
