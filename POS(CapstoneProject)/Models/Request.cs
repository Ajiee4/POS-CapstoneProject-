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
        [Required]
        public DateTime RequestDate { get; set; }
        [Required]
        public string Status { get; set; }
    }
}
