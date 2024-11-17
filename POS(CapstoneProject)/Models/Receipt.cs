using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace POS_CapstoneProject_.Models
{
    public class Receipt
    {
        [Key]
        public int ReceiptId { get; set; }
        public int OrderID { get; set; }
        [ForeignKey("OrderID")]
        public Order? Orders { get; set; }

        public int UserID { get; set; }
        [ForeignKey("UserID")]
        public User? Users { get; set; }

        [Required]
        public decimal TotalAmount { get; set; }
        [Required]
        [DataType(DataType.Date)]
        public DateTime Date { get; set; }
        [Required]
        public decimal TaxAmount { get; set; }
        [Required]
        public decimal DiscountAmount { get; set; }
        [Required]
        public decimal ChangeDue { get; set; }
        [Required]
        public decimal CashTendered { get; set; }

    }
}
