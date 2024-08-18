using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace POS_CapstoneProject_.Models
{
    public class OrderDetails
    {
        [Key]
        public int OrderDetailsID {  get; set; }
        [Required]
        public int OrderId { get; set; }

        [ForeignKey("OrderId")]
        public Order? Order { get; set; }
        [Required]
        public int ProductId { get; set; }

        [ForeignKey("ProductId")]
        public Product? Product { get; set; }
        [Required]
        public int Quantity { get; set; }
    }
}
