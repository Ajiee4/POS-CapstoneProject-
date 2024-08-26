using System.ComponentModel.DataAnnotations;

namespace POS_CapstoneProject_.Models
{
    public class Ingredient
    {
        [Key]
        public int IngredientId { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string UnitOfMeasurement { get; set; }
        [Required]
        public int Quantity { get; set; }
        [Required]
        public decimal CostPerUnit { get; set; }
        [DataType(DataType.Date)]
        public DateTime? ExpiryDate {  get; set; }
        [Required]
        public int LowStockThreshold {  get; set; }
    }
}
