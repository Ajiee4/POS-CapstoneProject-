using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace POS_CapstoneProject_.Models
{
    public class Order
    {
        [Key]
        public int OrderId { get; set; } 
        [Required]
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public User? User { get; set; }
        [Required]
        public decimal TotalAmount { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime OrderDate { get; set; }
    }
}
