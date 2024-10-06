namespace POS_CapstoneProject_.DTO
{
    //Use for adding orders in the db
    public class CheckOutList
    {
        public int prodID { get; set; }
        public string prodName { get; set; }
        public int prodQty { get; set; }
        public decimal prodPrice { get; set; }

    }
}
