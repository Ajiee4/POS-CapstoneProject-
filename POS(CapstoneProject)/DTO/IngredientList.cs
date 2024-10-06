namespace POS_CapstoneProject_.DTO
{

    //use for adding new request ingredients and stockout ingredients in the db
    public class IngredientList
    {
        public int ingredientId { get; set; }
        public string ingredientName { get; set; }
        public int ingredientQty { get; set; }

    }
}
