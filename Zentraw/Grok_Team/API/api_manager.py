import os
from dotenv import load_dotenv
import openai
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from github import Github
from supabase import create_client, Client
import subprocess  # Para Blender API (headless calls)

# Carregar variáveis de ambiente de .env (crie um .env com as chaves)
load_dotenv()

class ApiManager:
    def __init__(self):
        self.openai_client = None
        self.spotify_client = None
        self.github_client = None
        self.supabase_client = None
        self.blender_path = None  # Caminho para o executável do Blender
        self.additional_apis = {}  # Dicionário para APIs futuras
        
        self.init_apis()

    def init_apis(self):
        """Inicializa todos os clientes de API com chaves do .env"""
        # OpenAI
        openai_api_key = os.getenv('OPENAI_API_KEY')
        if openai_api_key:
            openai.api_key = openai_api_key
            self.openai_client = openai
            print("✅ OpenAI API inicializada com sucesso.")
        else:
            print("⚠️ OPENAI_API_KEY não encontrada no .env.")

        # Spotify
        spotify_client_id = os.getenv('SPOTIFY_CLIENT_ID')
        spotify_client_secret = os.getenv('SPOTIFY_CLIENT_SECRET')
        if spotify_client_id and spotify_client_secret:
            self.spotify_client = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials(client_id=spotify_client_id, client_secret=spotify_client_secret))
            print("✅ Spotify API inicializada com sucesso.")
        else:
            print("⚠️ SPOTIFY_CLIENT_ID ou SPOTIFY_CLIENT_SECRET não encontrados no .env.")

        # GitHub
        github_token = os.getenv('GITHUB_TOKEN')
        if github_token:
            self.github_client = Github(github_token)
            print("✅ GitHub API inicializada com sucesso.")
        else:
            print("⚠️ GITHUB_TOKEN não encontrado no .env.")

        # Supabase
        supabase_url = os.getenv('SUPABASE_URL')
        supabase_key = os.getenv('SUPABASE_KEY')
        if supabase_url and supabase_key:
            self.supabase_client = create_client(supabase_url, supabase_key)
            print("✅ Supabase API inicializada com sucesso.")
        else:
            print("⚠️ SUPABASE_URL ou SUPABASE_KEY não encontrados no .env.")

        # Blender (headless mode)
        blender_path = os.getenv('BLENDER_PATH')  # Ex.: /usr/bin/blender ou C:\Program Files\Blender Foundation\Blender 4.2\blender.exe
        if blender_path:
            self.blender_path = blender_path
            print("✅ Blender configurado para chamadas headless.")
        else:
            print("⚠️ BLENDER_PATH não encontrado no .env.")

        # Exemplo de APIs adicionais (adicione mais aqui)
        # API 6: Exemplo de Stripe
        stripe_api_key = os.getenv('STRIPE_API_KEY')
        if stripe_api_key:
            import stripe
            stripe.api_key = stripe_api_key
            self.additional_apis['stripe'] = stripe
            print("✅ Stripe API inicializada.")

        # API 7: Exemplo de Twilio
        twilio_account_sid = os.getenv('TWILIO_ACCOUNT_SID')
        twilio_auth_token = os.getenv('TWILIO_AUTH_TOKEN')
        if twilio_account_sid and twilio_auth_token:
            from twilio.rest import Client as TwilioClient
            self.additional_apis['twilio'] = TwilioClient(twilio_account_sid, twilio_auth_token)
            print("✅ Twilio API inicializada.")

        # Adicione mais APIs conforme necessário (até 10+)
        # Exemplo: API 8 - Google Cloud
        google_api_key = os.getenv('GOOGLE_API_KEY')
        if google_api_key:
            # Import e inicialize aqui
            print("✅ Google API inicializada.")

    def get_client(self, api_name):
        """Retorna o cliente de uma API específica"""
        if api_name == 'openai':
            return self.openai_client
        elif api_name == 'spotify':
            return self.spotify_client
        elif api_name == 'github':
            return self.github_client
        elif api_name == 'supabase':
            return self.supabase_client
        elif api_name in self.additional_apis:
            return self.additional_apis[api_name]
        else:
            raise ValueError(f"API {api_name} não encontrada ou não inicializada.")

    def run_blender_headless(self, script_path, args=[]):
        """Executa Blender em modo headless com um script Python"""
        if not self.blender_path:
            raise ValueError("Blender não configurado.")
        cmd = [self.blender_path, '--background', '--python', script_path] + args
        result = subprocess.run(cmd, capture_output=True, text=True)
        return result.stdout, result.stderr

# Instância global para uso em outros módulos
api_manager = ApiManager()

# Exemplo de uso em outro módulo
if __name__ == "__main__":
    # Exemplo: Chamar OpenAI
    if api_manager.openai_client:
        response = api_manager.openai_client.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": "Teste de API"}]
        )
        print(response)

    # Exemplo: Chamar Spotify
    if api_manager.spotify_client:
        results = api_manager.spotify_client.search(q='test', type='track')
        print(results)

    # Exemplo: Chamar Blender
    stdout, stderr = api_manager.run_blender_headless('path/to/script.py', ['--arg1', 'value'])
    print(stdout)