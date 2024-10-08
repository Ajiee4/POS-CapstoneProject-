namespace POS_CapstoneProject_.DTO
{
    public class InventoryReport
    {
        public string Name { get; set; }

        public DateTime TransactionDate { get; set; }
        public int TotalStockOut { get; set; }
        public int TotalStockIn { get; set; }
       

    }
}
