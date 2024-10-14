﻿namespace POS_CapstoneProject_.DTO
{
    //use for sales reporting
    public class SalesReport
    {
        public string Name { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalSales { get; set; }
        public int TotalSold { get; set; }

    }
}
