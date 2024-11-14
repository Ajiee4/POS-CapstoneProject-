using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace POS_CapstoneProject_.Models
{
    public class Receipt
    {
        [Key]
        public int ReceiptId {  get; set; }
        public int OrderId { get; set; }
        [ForeignKey("OrderId")]
        public Order? Order { get; set; }
        [Required]
        public decimal TotalAmount { get; set; }
        [Required]
        [DataType(DataType.Date)]
        public DateTime OrderDate { get; set; }

    }
}
