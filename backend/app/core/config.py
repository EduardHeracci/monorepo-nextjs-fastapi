from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql://postgres:postgres@database:5432/postgres"

    class Config:
        env_file = ".env"
