# Sample CSV Import Instructions

## 📁 **File Location**
The sample CSV file is located at: `sample-buyers.csv` in the root directory.

## 🚀 **How to Use**

1. **Download the File**: The `sample-buyers.csv` contains 15 sample buyer leads with various scenarios
2. **Navigate to Import**: Go to `/buyers` page in your app
3. **Find Import Section**: Look for the import section at the top of the buyers list
4. **Upload CSV**: Click "Choose File" and select `sample-buyers.csv`
5. **Submit**: Click "Import" to process the file

## 📊 **Sample Data Overview**

The CSV contains **15 diverse buyer leads** covering:

### **Cities Covered:**
- Chandigarh (5 leads)
- Mohali (3 leads) 
- Zirakpur (2 leads)
- Panchkula (3 leads)
- Other (2 leads)

### **Property Types:**
- **Apartments**: 7 leads (various BHK: 1, 2, 3, Studio)
- **Villas**: 3 leads (3BHK, 4BHK)
- **Plots**: 3 leads (investment/agricultural)
- **Office**: 2 leads (rental/purchase)
- **Retail**: 1 lead (shop)

### **Budget Ranges:**
- **Low Budget**: ₹15,000 - ₹30,000 (rentals)
- **Mid Budget**: ₹2.5L - ₹9L (apartments/plots)
- **High Budget**: ₹15L - ₹20L (luxury villas)
- **Commercial**: ₹50K - ₹120K (office rentals)

### **Lead Status Distribution:**
- New: 6 leads
- Qualified: 3 leads
- Contacted: 3 leads
- Visited: 2 leads
- Negotiation: 1 lead
- Exploring: 1 lead

### **Special Test Cases:**
- **Missing Emails**: Some leads have empty email fields (valid scenario)
- **Optional BHK**: Plot/Office/Retail properties don't have BHK (as expected)
- **Required BHK**: Apartments/Villas have BHK values (validation test)
- **Multiple Tags**: Various tag combinations (NRI, Urgent, Family, etc.)
- **Different Sources**: Website, Referral, Walk-in, Call, Other

## ✅ **Expected Import Results**

When you import this CSV:
- **Total Rows**: 15
- **Expected Success**: All 15 rows should import successfully
- **Validation**: All data follows your schema rules
- **Error Testing**: Try modifying the CSV to test validation (e.g., remove required BHK from Apartment)

## 🧪 **Testing Validation**

To test error handling, try these modifications:

1. **Remove BHK from Apartment**:
   ```csv
   Rajesh Kumar,rajesh@gmail.com,9876543210,Chandigarh,Apartment,,Buy,...
   ```
   Expected: Error "bhk: BHK required for Apartment/Villa"

2. **Invalid Budget**:
   ```csv
   Priya Sharma,priya.sharma@outlook.com,9988776655,Mohali,Villa,3,Buy,12000000,8000000,...
   ```
   Expected: Error "budgetMax: budgetMax must be ≥ budgetMin"

3. **Invalid Phone**:
   ```csv
   Amit Singh,,912345,Zirakpur,Plot,,Buy,...
   ```
   Expected: Error "phone: Phone must be 10-15 digits"

4. **Invalid City**:
   ```csv
   Neha Gupta,neha@email.com,8765432109,InvalidCity,Office,,Rent,...
   ```
   Expected: Error "city: Invalid enum value"

## 📈 **After Import**

Once imported successfully, you can:
- **View All Leads**: See the 15 leads in your buyers list
- **Test Filtering**: Filter by city, property type, status, timeline
- **Test Search**: Search by names, phones, emails
- **Test Export**: Export the filtered data back to CSV
- **Edit Leads**: Click "View / Edit" to modify any lead
- **Check History**: View change history for edited leads

## 🎯 **Pro Tips**

- **Backup Test**: Export existing data before importing if you have real data
- **Batch Size**: The system supports up to 200 rows per import
- **Error Handling**: Invalid rows are skipped, valid ones are imported
- **Transaction Safety**: All imports are done in database transactions
- **Duplicate Handling**: No duplicate checking - imports will create new records

Enjoy testing your buyer lead management system! 🚀

`Assignment Link: https://www.notion.so/esahayak/Assignment-Mini-Buyer-Lead-Intake-App-26bcebc7e1bd80aab557ddd9adc332fe`