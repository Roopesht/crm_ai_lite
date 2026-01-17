from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "AICRM Lite"
    APP_ENV: str = "dev"
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 8000

    DB_HOST: str = "localhost"
    DB_PORT: int = 3306
    DB_NAME: str = "aicrm_lite"
    DB_USER: str = "root"
    DB_PASSWORD: str = "password"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
