using System.ComponentModel.DataAnnotations;

namespace POS_CapstoneProject_.Models
{
    public class Category
    {
        [Key]
        public int CategoryId { get; set; }
        [Required]
        public string CategoryType { get; set; }
        [Required]
        public string CategoryName { get; set; }

    }
}
