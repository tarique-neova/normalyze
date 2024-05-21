import json
import logging
import os
from pathlib import Path
import requests

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

class InitializeConfigurations:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(InitializeConfigurations, cls).__new__(cls)
        return cls._instance

    def __init__(self):
        if hasattr(self, 'initialized'):
            return
        self.initialized = True

        # Initialize your paths here
        self.normalyze_app_credentials_file_path = 'data/compliance/ui/NormalyzeApplicationCredentials.json'
        self.api_links_file_path = 'data/compliance/APILinks.json'
        self.gcp_data_generator_output_file_path = 'data/compliance/cloud/gcp/GCPDataGeneratorOutput.json'
        self.azure_data_generator_output_file_path = 'data/compliance/cloud/azure/AZUREDataGeneratorOutput.json'

class InitializeValidatorConfigurations:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(InitializeValidatorConfigurations, cls).__new__(cls)
        return cls._instance

    def __init__(self):
        if hasattr(self, 'initialized'):
            return
        self.initialized = True

        self.login_cookie_string = ''
        self.app_username = ''
        self.app_password = ''
        self.app_url = ''
        self.api_base_url = ''
        self.app_environment_profile = ''
        self.api_links_object = {}

        self.auth_system_type = ''
        self.benchmark_version = ''
        self.benchmark = ''

        self.data_generator_test_cases_object = []

        self.set_environment_variables()
        self.set_app_environment_profile()
        self.initialize_normalyze_app_credentials()
        self.api_links_object = self.get_api_links_object()
        self.login_cookie_string = self.get_login_cookie_string()
        self.data_generator_test_cases_object = self.load_data_generator_output()

    def set_app_environment_profile(self):
        if not os.getenv('avEnv'):
            try:
                with open(Path(InitializeConfigurations().get_instance().normalyze_app_credentials_file_path)) as f:
                    data = json.load(f)
                    self.app_environment_profile = data['defaultProfile'].lower()
            except Exception as e:
                logger.error("Failed to load normalyze App Environment Profile", exc_info=e)
        else:
            self.app_environment_profile = os.getenv('avEnv').lower()

    def initialize_normalyze_app_credentials(self):
        try:
            with open(Path(InitializeConfigurations().get_instance().normalyze_app_credentials_file_path)) as f:
                data = json.load(f)
                env_data = data[self.app_environment_profile]
                self.app_username = env_data['appUsername']
                self.app_password = env_data['appPassword']
                self.app_url = env_data['appUrl']
                self.api_base_url = env_data['apiBaseUrl']
        except Exception as e:
            logger.error("Failed to create normalyze App Credentials Object", exc_info=e)

    def get_login_cookie_string(self):
        url = self.get_login_api_link()
        payload = {
            'email': self.app_username,
            'password': self.app_password
        }
        headers = {
            'Content-Type': 'application/json'
        }
        try:
            session = requests.Session()
            response = session.post(url, data=json.dumps(payload), headers=headers)
            response.raise_for_status()
            cookies = response.cookies.get_dict()
            cookie_string = "; ".join([f"{key}={value}" for key, value in cookies.items()])
            return cookie_string
        except Exception as e:
            logger.error("Error while parsing cookies", exc_info=e)
            return ""

    def set_environment_variables(self):
        self.auth_system_type = os.getenv("authSystemType", "")
        self.benchmark_version = os.getenv("benchmarkVersion", "")
        self.benchmark = os.getenv("benchmark", "")

    def get_api_links_object(self):
        try:
            with open(Path(InitializeConfigurations().get_instance().api_links_file_path)) as f:
                data = json.load(f)
                return data
        except Exception as e:
            logger.error("Error while loading API Links", exc_info=e)
            return {}

    def load_data_generator_output(self):
        auth_system_selected = os.getenv("authSystemType", "").lower()
        file_to_load = ''
        if auth_system_selected == 'gcp':
            file_to_load = InitializeConfigurations().get_instance().gcp_data_generator_output_file_path
        elif auth_system_selected == 'azure':
            file_to_load = InitializeConfigurations().get_instance().azure_data_generator_output_file_path
        else:
            logger.error("Unsupported auth system type")
            raise SystemExit(1)

        try:
            with open(file_to_load) as f:
                data = json.load(f)
                return data
        except Exception as e:
            logger.error("Error while loading data generator output", exc_info=e)
            return []

    def get_login_api_link(self):
        # Assuming this method returns the login API link from self.api_links_object
        # Add actual logic to fetch the login link from self.api_links_object
        return self.api_links_object.get('login', '')

# Make sure to replace 'path/to/...' with the actual paths to your files
