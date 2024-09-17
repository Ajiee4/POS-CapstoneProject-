namespace POS_CapstoneProject_.Models
{
    public class InventoryReport
    {

        public DateTime Date { get; set; }
        public int TotalStockIn {get; set;}
        public int TotalStockOut {get; set;}
        public int CurrentStock {  get; set;}
    }
}
