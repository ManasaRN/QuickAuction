window.onload = function() {
	
 web3.eth.defaultAccount = web3.eth.accounts[0]
// Keep track of all auctions
var auctionID = 0;
 var auctions = [];
 var accounts = web3.eth.accounts;
 web3.eth.defaultAccount = accounts[0]
var quickAuction = web3.eth.contract(QuickAuction);
 var myquickAuction = quickAuction.abi._json.abi;
 showAccounts();
 
 QuickAuction.new().then(
 function(conf) {
 quickAuction = quickAuction.at(conf.address);
 myquickAuction = conf;

 // watch for changes
 myquickAuction.Update().watch(function(error, event) {
 if (!error) {
 updateAuction(event.args);
 console.log('auctions', auctions);
 } else {
 console.log('error occurred', err);
 }
 });
 myquickAuction.Ended().watch(function(error, event) {
 if (!error) {
 console.log('auction ended', event);
 removeAuction(event.args);
 } else {
 console.log('error occurred', err);
 }
 });
showAccounts();
showBalances();
console.log('quickAuction created');
 }, function(err) {
 console.log(err);
 });
function showAccounts() {
 var accountSelect = document.getElementById("accountSelect");
 accounts.unshift('');
accounts.forEach(function(account) {
 var option = document.createElement("option");
 
 option.text = account;
 if(option.text == "0xaeaab61c85b4f4838d0c3066f008d34382f40973"){
   option.text = "User";
 }
 if(option.text == "0x5c1d73d189d6b8f0e236688a0a41bb948edbb731"){
   option.text = "Vendor";
 }
 option.value = account;
 accountSelect.add(option);
 });
 $("#accountSelect").on("change",function(){
	 var selectedAccount= $("#accountSelect option:selected").html();
   if(selectedAccount == "User"){
   selectedAccount = "0xaeaab61c85b4f4838d0c3066f008d34382f40973";
 }
 if(selectedAccount == "Vendor"){
   selectedAccount = "0x5c1d73d189d6b8f0e236688a0a41bb948edbb731";
 }
	 var auctionAccount= "0xaeaab61c85b4f4838d0c3066f008d34382f40973";
	 var placeBidAccount= "0x5c1d73d189d6b8f0e236688a0a41bb948edbb731"
	 if(selectedAccount==auctionAccount){
		 $(".place-bid").css("display", "none");
		 $(".create-auction").css("display", "block");
     $(".error").css("display", "none");
        $(".endAuction").css("display", "block");
         
	}else if(selectedAccount==placeBidAccount){
		 $(".create-auction").css("display", "none");
		 $(".place-bid").css("display", "block");
      $(".error").css("display", "none");
       $(".endAuction").css("display", "none");
	 }
 });
 
$("#quickAuctionAddress").html(quickAuction.address);
 }
function showBalances() {
 var table = document.getElementById("balances").getElementsByTagName('tbody')[0];
 $("#balances tbody").empty();
accounts.forEach(function(account) {
 var row = table.insertRow(0);
 var balance='';
 if(account!=""){
 balance = web3.eth.getBalance(account);
 }
 console.log(account, balance);
 if(account!=""){
 balance = web3.fromWei(balance.toNumber(), 'ether');
 }
var addressCell = row.insertCell(0);
 var balanceCell = row.insertCell(1);
addressCell.innerHTML = account;
 balanceCell.innerHTML = balance
 });
// Show contract balance
 var row = table.insertRow(0);
 var balance = web3.eth.getBalance(quickAuction.abi.network.address);
 balance = web3.fromWei(balance.toNumber(), 'ether');
var addressCell = row.insertCell(0);
 var balanceCell = row.insertCell(1);
addressCell.innerHTML = 'Contract';
 balanceCell.innerHTML = balance
}
function showAuctions() {
 var auctionSelect = document.getElementById("auctionSelect");
 $('#auctionSelect').find('option').remove().end();
auctions.forEach(function(auction) {
 var option = document.createElement("option");
 option.text = auction.name;
 option.value = auction.auctionID;
 auctionSelect.add(option);
 });
 }
// Function to add auctione
 function updateAuction(data, name, buyerAddress, amt, id) {
	 
 auctions[data] = {};
 auctions[data].auctionID = id;
 auctions[data].name = name;
 auctions[data].highestBid = amt;
 auctions[data].highestBidder = buyerAddress;
 auctions[data].receipt = data.receipt.logs[0].address;
auctions.push(auctions[data]);
var auction = auctions[auctions[data].auctionID];
 
  // Update select
 showAuctions();
 showBalances();
// Update table
 var table = document.getElementById("auctions").getElementsByTagName('tbody')[0];
 $('table#auctions tr#auction-' + auction.auctionID).remove();
var row = table.insertRow(0);
 row.id = 'auction-' + auction.auctionID;
var idCell = row.insertCell(0);
 var nameCell = row.insertCell(1);
 var highestBidCell = row.insertCell(2);
 var highestBidderCell = row.insertCell(3);
 var receiptCell = row.insertCell(4);
 var buttonCell = row.insertCell(5);
idCell.innerHTML = auction.auctionID;
 nameCell.innerHTML = auction.name;
 highestBidCell.innerHTML = amt;
 highestBidderCell.innerHTML = auction.highestBidder == '0x0000000000000000000000000000000000000000' ? '/' : auction.highestBidder;
 receiptCell.innerHTML = auction.receipt;
   buttonCell.innerHTML = '<button class="endAuction" data-id="' + auction.auctionID + '">End</button>'
 
 //row.remove(highestBidCell.innerHTML);
 }

function updateAuctionPlaceBid(data, name, buyerAddress, amt, id) {
    	 
  // Update select
 showAuctions();
 showBalances();
// Update table
var auction = auctions[id];
 var table = document.getElementById("auctions").getElementsByTagName('tbody')[0];
 $('table#auctions tr#auction-' + auction.auctionID).remove();
var row = table.insertRow(0);
 row.id = 'auction-' + auction.auctionID;
var idCell = row.insertCell(0);
 var nameCell = row.insertCell(1);
 var highestBidCell = row.insertCell(2);
 var highestBidderCell = row.insertCell(3);
 var receiptCell = row.insertCell(4);
 var buttonCell = row.insertCell(5);
idCell.innerHTML = auction.auctionID;
 nameCell.innerHTML = auction.name;
 highestBidCell.innerHTML = amt;
 highestBidderCell.innerHTML = auction.highestBidder == '0x0000000000000000000000000000000000000000' ? '/' : auction.highestBidder;
 receiptCell.innerHTML = auction.receipt;
 buttonCell.innerHTML = '<button class="endAuction" data-id="' + auction.auctionID + '">End</button>'
 $(".endAuction").css("display", "none");

 //row.remove(highestBidCell.innerHTML);
 }

 
function endAuctionBid(id) {
    	 
  // Update select
 showAuctions();
 showBalances();
// Update table
var auction = auctions[id];
 var table = document.getElementById("auctions").getElementsByTagName('tbody')[0];
 $('table#auctions tr#auction-' + auction.auctionID).remove();
var row = table.insertRow(0);
 row.id = 'auction-' + auction.auctionID;
var idCell = row.insertCell(0);
 var nameCell = row.insertCell(1);
 var highestBidCell = row.insertCell(2);
 var highestBidderCell = row.insertCell(3);
 var receiptCell = row.insertCell(4);
 var buttonCell = row.insertCell(5);
 row.remove(auction.auctionID);
 delete auctions[id];
  showAuctions();
 }

function removeAuction(data) {
 $('table#auctions tr#auction-' + data.auctionID).remove();
 showBalances();
 }
function startAuction(name, timeLimit, buyerAddress) {
QuickAuction.deployed().then(instance => instance.startAuction(name, timeLimit, { from: buyerAddress }).then(
 function(auction) {
 console.log('Action created: ', auction);
  updateAuction(auction, name, auction.receipt.from, 0, auctionID++);
 // Update table
 $("#bidError2").show().delay(3000).fadeOut();
  }));
  showBalances();
 
 }
function endAuction(auctionID, buyerAddress) {
 var auction = auctions[auctionID];
 endAuctionBid(auctionID);
 $("#bidError3").show().delay(3000).fadeOut();
 if (auction.receipt != buyerAddress) {
 $("#auctionError").show().delay(3000).fadeOut();
 return;
 }
 
 QuickAuction.deployed().then(instance => instance.endAuction(auctionID).then(
 function(auction) {
 console.log('Auction ended: ', auction);
   // Update table
    endAuctionBid(auctionID);
 
  }));
 
 }
function placeBid(bid, auctionID, buyerAddress) {
 var auction1 = auctions[auctionID];
 console.log('bid', bid);
 console.log('auction.highestBid', auction1);
 var addr = auction1.highestBid.highestBidder;

//bid = web3.toWei(bid, 'ether');
 console.log(bid);
 
 QuickAuction.deployed().then(instance => instance.placeBid(auctionID, bid).then(
 function(auction) {
 console.log('Bid placed: ', auction);
   // Update table
   if(auction1.highestBid != 0 && auction1.highestBid > bid){
        auction1.highestBid = auction1.highestBid;
		$("#bidError").show().delay(3000).fadeOut();
   }
   else{
  updateAuctionPlaceBid(auction, name, auction.receipt.from, bid, auctionID);
  auction1.highestBid = bid;
  $("#bidError1").show().delay(3000).fadeOut();
   }
  }));
 }
$("#startAuction").click(function() {
 var buyerAddress = $("#accountSelect option:selected").val();
 var auctionName = $("#auctionName").val();
 $("#auctionName").val("");
startAuction(auctionName, 10000, buyerAddress);
 });
$('body').on('click', '.endAuction', function(e) {
 var auction = $(this).attr("data-id");
 var buyerAddress = $("#accountSelect option:selected").val();
 endAuction(auction, buyerAddress);
 });
 
 $("#placeBid").click(function() {
 var bid = parseInt($("#bidAmount").val());
 var auction = $('#auctionSelect').find(":selected").val();
 var buyerAddress = $("#accountSelect option:selected").val();
 $("#bidAmount").val("");
 if(auction == null){
 auction = 0;
 }
placeBid(bid, auction, buyerAddress);
 });
};