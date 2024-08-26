using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace POS_CapstoneProject_.Models
{
    public class InventoryTransactionDetail
    {
        [Key]
        public int InventoryTransactDetailId {  get; set; }
        [Required]
        public int InventoryTransactId { get; set; }
        [ForeignKey("InventoryTransactId")]
        public InventoryTransaction? InventoryTransaction { get; set; }
        [Required]
        public int IngredientId { get; set; }
        [ForeignKey("IngredientId")]
        public Ingredient? Ingredient { get; set; }
        [Required]
        public int Quantity {  get; set; }
        [Required]
        public string Remarks {  get; set; }
    }
}
