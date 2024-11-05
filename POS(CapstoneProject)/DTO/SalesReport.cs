namespace POS_CapstoneProject_.DTO
{
    //use for sales reporting
    public class SalesReport
    {
        public string Name { get; set; }
        public string OrderDate { get; set; }
        public decimal TotalSales { get; set; }
        public int TotalSold { get; set; }
     
     

    }

    public class SalesData
    {
        public string Month { get; set; }
        public decimal Amount { get; set; }
    }
}
