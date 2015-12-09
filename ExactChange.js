/* My (inelegant) solution to the "Exact Change" bonfire.  It *looks* like it's
returning correct answers, but it's not passing tests.  The failed tests are 
called (well... commented out) at the bottom of this page */


//This is the actual function: helper functions below
function drawer(price, payment, cid) {
	
	var amount_due = calculate_change_due(price, payment);
	console.log("amount_due is " + amount_due);
	
	var drawer_total = calculate_change_in_drawer(cid);
	console.log("drawer total is " + drawer_total);
	
	var enough_in_drawer = sufficient_funds_check(amount_due, drawer_total);
	console.log("Do we have sufficient funds? " + enough_in_drawer);
	
	if (enough_in_drawer[0] === false) {
		console.log("Returning: " + enough_in_drawer[1]);
		return enough_in_drawer[1];
	} else {
		var change_amounts = calculate_change(amount_due, cid);
		console.log("Returning: " + change_amounts);
		return change_amounts;
	}
}

function calculate_change_due(price_paid, payment_rendered) {
	var change_due = payment_rendered - price_paid;
	return change_due;
}

function calculate_change_in_drawer(cid) {
	var total_cid = 0;
	for (var i = 0; i < cid.length; i++) {
		total_cid += cid[i][1];
	}
	return total_cid;
}

/*returns two-element list: first is boolean (enough == true), 
second is error message (if false). This has to be repeated later, to catch situations 
where you have enough money but not exact change*/
function sufficient_funds_check(change_due, total_cid) {
	var check_result = [false, 0];
	if (change_due > total_cid) {
		check_result[1] = "Insufficient Funds";
	} else if (change_due == total_cid) {
		check_result[1] = "Closed";
	} else {
		check_result[0] = true;
	}
	return check_result;
}

/* Here's where I actually figure out how much of each bill/coin to give back */
function calculate_change(change_due, cid) {
	
	//convert eventhing to cents, for easier calculations
	var cents_due = change_due * 100;
	var cid_in_cents = cid;
	var change = [["HUNDRED", 0], ["TWENTY", 0], ["TEN", 0], 
			["FIVE", 0], ["ONE", 0], ["QUARTER", 0], ["DIME", 0], 
			["NICKEL", 0], ["PENNY", 0]];
	for (var i = 0; i < cid.length; i++) {
		cid_in_cents[i][1] = 100 * cid[i][1];
	}
	
	//This whole section should probably be rewritten with a function...
	//hundreds added to change
	while (Math.floor(cents_due / 10000) > 0 && cid_in_cents[8][1] > 0) {
		change[0][1] += 10000;
		cid_in_cents[8][1] -= 10000;
		cents_due -= 10000;
	}
	//twenties added to change
	while (Math.floor(cents_due / 2000) > 0 && cid_in_cents[7][1] > 0) {
		change[1][1] += 2000;
		cid_in_cents[7][1] -= 2000;
		cents_due -= 2000;
	}
	//tens added to change
	while (Math.floor(cents_due / 1000) > 0 && cid_in_cents[6][1] > 0) {
		change[2][1] += 1000;
		cid_in_cents[6][1] -= 1000;
		cents_due -= 1000;
	}
	//fives added to change
	while (Math.floor(cents_due / 500) > 0 && cid_in_cents[5][1] > 0) {
		change[3][1] += 500;
		cid_in_cents[5][1] -= 500;
		cents_due -= 500;
	}
	//ones added to change
	while (Math.floor(cents_due / 100) > 0 && cid_in_cents[4][1] > 0) {
		change[4][1] += 100;
		cid_in_cents[4][1] -= 100;
		cents_due -= 100;
	}
	//quarters added to change
	while (Math.floor(cents_due / 25) > 0 && cid_in_cents[3][1] > 0) {
		change[5][1] += 25;
		cid_in_cents[3][1] -= 25;
		cents_due -= 25;
	}
	//dimes added to change 
	while (Math.floor(cents_due / 10) > 0 && cid_in_cents[2][1] > 0) {
		change[6][1] += 10;
		cid_in_cents[2][1] -= 10;
		cents_due -= 10;
	}
	//nickels added to change
	while (Math.floor(cents_due / 5) > 0 && cid_in_cents[1][1] > 0) {
		change[7][1] += 5;
		cid_in_cents[1][1] -= 5;
		cents_due -= 5;
	}
	//pennies added to change
	while (cents_due > 0 && cid_in_cents[0][1] > 0) {
		change[8][1] += 1;
		cid_in_cents[0][1] -= 1;
		cents_due -= 1;
	}
	
	//convert change back to dollars and cents
	for (var j = 0; j < change.length; j++) {
		change[j][1] = (change[j][1] / 100).toFixed(2);
	}
	
	//filter out bills/counts with value zero
	function is_nonzero(value) {
		return value[1] != 0;
	}
	change_filtered = change.filter(is_nonzero);
	
	/*check that cents_due is zero (it might not be if 
	we have, say, all hundreds in the drawer).*/
	if (cents_due > 0) {
		change_filtered = "Insufficient Funds";
	}
	return change_filtered;
}

/* The tests I'm not passing.  */
/*
console.log('first test is: drawer(19.50, 20.00, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.10], ["QUARTER", 4.25], ["ONE", 90.00], ["FIVE", 55.00], ["TEN", 20.00], ["TWENTY", 60.00], ["ONE HUNDRED", 100.00]])');

console.log('my answer: ');
console.log(drawer(19.50, 20.00, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.10], ["QUARTER", 4.25], ["ONE", 90.00], ["FIVE", 55.00], ["TEN", 20.00], ["TWENTY", 60.00], ["ONE HUNDRED", 100.00]]));

console.log('correct answer: should return [["QUARTER", 0.50]]');

console.log('second test is: drawer(3.26, 100.00, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.10], ["QUARTER", 4.25], ["ONE", 90.00], ["FIVE", 55.00], ["TEN", 20.00], ["TWENTY", 60.00], ["ONE HUNDRED", 100.00]])');

console.log('my answer: ');
console.log(drawer(3.26, 100.00, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.10], ["QUARTER", 4.25], ["ONE", 90.00], ["FIVE", 55.00], ["TEN", 20.00], ["TWENTY", 60.00], ["ONE HUNDRED", 100.00]]));

console.log('correct answer: should return [["TWENTY", 60.00], ["TEN", 20.00], ["FIVE", 15], ["ONE", 1], ["QUARTER", 0.50], ["DIME", 0.20], ["PENNY", 0.04]]');
*/
