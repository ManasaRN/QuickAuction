contract QuickAuction {
   struct auction {
      uint highestBid;
      address highestBidder;
      address recipient;
      string name;
   }
   mapping(uint => auction) Auctions;
   uint public totalAuctions;
  event Update(string name, uint highestBid, address highestBidder, address recipient, uint auctionID);
  event Ended(uint auctionID);
  function startAuction(string name, uint timeLimit) returns (uint auctionID) {
     auctionID = totalAuctions++;
     Auctions[auctionID].recipient = msg.sender;
     Auctions[auctionID].name = name;
    Update(name, Auctions[auctionID].highestBid, Auctions[auctionID].highestBidder, Auctions[auctionID].recipient, auctionID);
   }
   function placeBid(uint id, uint value) returns (address highestBidder) {
      auction a = Auctions[id];
      if (a.highestBid != 0 && a.highestBid > value) {
         msg.sender.send(msg.value);
         return a.highestBidder;
      }
      a.highestBidder.send(a.highestBid);
      a.highestBidder = msg.sender;
      a.highestBid = value;
      Update(a.name, a.highestBid, a.highestBidder, a.recipient, id);  
      return msg.sender;
   }
   function endAuction(uint id) returns (address highestBidder) {
      auction a = Auctions[id];
      if (msg.sender != a.recipient) {
         msg.sender.send(msg.value);
         return a.recipient;
      }
      a.recipient.send(a.highestBid);
      a.highestBid = 0;
      a.highestBidder =0;
      a.recipient = 0;
      Ended(id);
   }
   function getHighestBid(uint id) constant returns (uint highestBid) {
      return Auctions[id].highestBid;
   }
 
   function getAuction(uint id) constant returns (uint highestBid, address highestBidder, address recipient, string name) {
      auction a = Auctions[id];
      highestBid = a.highestBid;
      highestBidder = a.highestBidder;
      recipient = a.recipient;
      name = a.name;
   }
}