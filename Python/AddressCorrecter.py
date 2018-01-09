from smartystreets_python_sdk import StaticCredentials, exceptions, ClientBuilder
from smartystreets_python_sdk.us_street import Lookup

class AddressCorrecter:
    """ Validates and returns a corrected address.
    """
    def __init__(self):
        self.auth_id = '839867c5-ea75-9d4f-10da-85b8fd453ba9'
        self.auth_token = 'uU5o6MjSolIc00dxVYeA'
        self.credentials = StaticCredentials(self.auth_id, self.auth_token)
        self.client = ClientBuilder(self.credentials).build_us_street_api_client()
        self.lookup = Lookup()

    def _lookup_one(self, address, city):
        self.lookup.street = address
        self.lookup.city = city
        self.lookup.state = "CA"
        try:
            self.client.send_lookup(self.lookup)
        except exceptions.SmartyException as err:
            print(err)
            return

        result = self.lookup.result

        if not result:
            # print("Address not valid.")
            return False

        first_candidate = result[0]
        return first_candidate.delivery_line_1

# if __name__ == "__main__":
#     ac = AddressCorrecter()
#     ac._lookup_one("528 Shorebird Cir #8204", "Redwood City")