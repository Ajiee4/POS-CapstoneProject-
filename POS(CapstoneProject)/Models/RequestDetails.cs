using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace POS_CapstoneProject_.Models
{
    public class RequestDetails
    {
        [Key]
        public int RequestDetailsId {  get; set; }

        public int RequestId {  get; set; }
        [ForeignKey("RequestId")]
        public Request? Request {  get; set; }
        [Required]
        public int IngredientId { get; set; }
    
        [ForeignKey("IngredientId")]
        public Ingredient? Ingredient { get; set; }
        public int Quantity {  get; set; }

    }
}
