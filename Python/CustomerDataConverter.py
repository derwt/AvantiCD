import csv
import time
import AddressCorrecter as AC

class CustomerDataConverter:
        
    def __init__(self):
        self.section_one_ending = 3165
        self.customer_data = {}
        self.customers_failed = 0
        self.address_corrector = AC.AddressCorrecter()

    def _convert_txt_to_csv(self, txt_filename, csv_filename):
        with open(txt_filename, 'r') as infile, open(csv_filename, 'w', newline='') as outfile:
            csvwriter = csv.writer(outfile)
            for i, line in enumerate(infile):
                split_line = line.split(':')
                if i < self.section_one_ending:
                    CID = int(split_line[1].strip())
                    phone_number = int(split_line[0])
                    self._add_customer(CID, phone_number)

                elif i == self.section_one_ending:
                    continue
                else:
                    CID = int(split_line[0])
                    city = split_line[1]
                    address = self.address_corrector._lookup_one(split_line[2], self._get_city_from_abbrv(city))
                    if not address:
                        address = split_line[2]
                    print(address)
                    cross_street = split_line[3]
                    note = split_line[4]
                    time = split_line[5]
                    try:
                        self._complete_customer(CID, city, address, cross_street, note, time)
                        csvwriter.writerow(self.customer_data[CID]._get_customer_data(CID), )
                    except Exception as ex:
                        self.customers_failed += 1
            print("Customers Failed: " + str(self.customers_failed))
            self.customer_data[1297]._print_customer_data()

    def _add_customer(self, CID, phone_number):
        self.customer_data[CID] = Customer(phone_number)  

    def _complete_customer(self, CID, city, address, cross_street, note, time):
        self.customer_data[CID].city = city
        self.customer_data[CID].address = address
        self.customer_data[CID].cross_street = cross_street
        self.customer_data[CID].note = note
        self.customer_data[CID].time_last_ordered = time

    def _get_city_from_abbrv(self, abbreviation):
        return {
            "BL":"Belmont",
            "SC":"San Carlos",
            "SM":"San Mateo",
            "RWS":"Redwood Shores",
            "RWC":"Redwood City",
            "FC":"Foster City",
            "HB":"Hillsborough",
            "":""
        }[abbreviation]

class Customer:

    def __init__(self, number=0, city="", address="", cross_street="", note="", time_last_ordered=0):
        self.phone_number = number
        self.city = city
        self.address = address
        self.cross_street = cross_street
        self.note = note
        self.time_last_ordered = time_last_ordered

    def _set_customer_data(self, city, address, cross_street, note, time_last_ordered):
        """ Sets remaining attributes, to be used to complete customer data entry. """
        self.city = city
        self.address = address
        self.cross_street = cross_street
        self.note = note
        self.time_last_ordered = time_last_ordered

    def _get_customer_data(self, CID):
        return [CID, self.phone_number, self.city, self.address, self.cross_street, self.note, self.time_last_ordered]

    def _print_customer_data(self):
        print("Phone #:    " + str(self.phone_number))
        print("City:       " + self.city)
        print("Address:    " + self.address)
        print("Cross:      " + self.cross_street)
        print("Note:       " + self.note)
        print("Last Order: " + time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(int(self.time_last_ordered))))


if __name__ == "__main__":
    cdc = CustomerDataConverter()
    cdc._convert_txt_to_csv("numbers.txt", "customers.csv")
