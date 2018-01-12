import csv
import time
import AddressCorrecter as AC

class CustomerDataConverter:
        
    def __init__(self):
        self.section_one_ending = 3165
        self.customer_data = {}
        self.customers_failed = 0
        # self.address_corrector = AC.AddressCorrecter()

    def _convert_txt_to_csv(self, txt_filename, csv_filename):
        with open(txt_filename, 'r') as infile, open(csv_filename, 'w', newline='') as outfile:
            csvwriter = csv.writer(outfile)
            for i, line in enumerate(infile):
                split_line = line.split(':')
                if i < self.section_one_ending:
                    cid = int(split_line[1].strip())
                    phone_number = int(split_line[0])
                    if not self._customer_exists(cid):
                        self._add_customer(cid, phone_number)
                    else:
                        self.customer_data[cid]._add_phone_number(phone_number)

                elif i == self.section_one_ending:
                    continue
                else:
                    cid = int(split_line[0])
                    city = split_line[1]
                    # address = self.address_corrector._lookup_one(split_line[2], self._get_city_from_abbrv(city))
                    # if not address:
                    address = split_line[2]
                    cross_street = split_line[3]
                    note = split_line[4]
                    time = split_line[5]
                    try:
                        self._complete_customer(cid, city, address, cross_street, note, time)
                        csvwriter.writerow(self.customer_data[cid]._get_customer_data(cid), )
                    except Exception as ex:
                        self.customers_failed += 1
            print("Customers Failed: " + str(self.customers_failed))
            self.customer_data[1847]._print_customer_data()
            print(self.customer_data[1337].phone_numbers)

    def _add_customer(self, cid, phone_number):
        self.customer_data[cid] = Customer(phone_number)  

    def _complete_customer(self, cid, city, address, cross_street, note, time):
        self.customer_data[cid].city = city
        self.customer_data[cid].address = address
        self.customer_data[cid].cross_street = cross_street
        self.customer_data[cid].note = note
        self.customer_data[cid].time_last_ordered = time

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

    def _customer_exists(self, cid):
        return cid in self.customer_data

class Customer:
    """ Contains all data 
    """

    def __init__(self, numbers=0, city="", address="", cross_street="", note="", time_last_ordered=0):
        self.phone_numbers = [numbers]
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

    def _get_customer_data(self, cid):
        return [cid, self.phone_numbers, self.city, self.address, self.cross_street, self.note, self.time_last_ordered]

    def _add_phone_number(self, number):
        self.phone_numbers.append(number)

    def _print_customer_data(self):
        print("Phone #:    " + str(self.phone_numbers))
        print("City:       " + self.city)
        print("Address:    " + self.address)
        print("Cross:      " + self.cross_street)
        print("Note:       " + self.note)
        print("Last Order: " + time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(int(self.time_last_ordered))))


if __name__ == "__main__":
    cdc = CustomerDataConverter()
    cdc._convert_txt_to_csv("numbers.txt", "customers.csv")
