using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace POS_CapstoneProject_.Models
{
    public class Request
    {
        [Key]
        public int RequestId { get; set; }
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public User? User { get; set; }
     
        [DataType(DataType.Date)]
        public DateTime RequestDate { get; set; }
       
        public DateTime? CompletedDate { get; set; }
      
        public DateTime? CanceledDate { get; set; }
        [Required]
        public string Status { get; set; }
    }
}
