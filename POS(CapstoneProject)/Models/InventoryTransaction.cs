using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace POS_CapstoneProject_.Models
{
    public class InventoryTransaction
    {
        [Key]
        public int InventoryTransactId { get; set; }
        [Required]
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public User? User { get; set; }
        [DataType(DataType.Date)]
        public DateTime TransactionDate { get; set; }
        [Required]
        public string TransactionType { get; set; }
        public int? RequestId {  get; set; }
        [ForeignKey("RequestId")]
        public Request? Request { get; set; }
    }
}
