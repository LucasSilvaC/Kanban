from django.db import models
from django.core.validators import MinLengthValidator

class User(models.Model):
    name = models.CharField(
        "Nome",
        max_length=150,
        validators=[MinLengthValidator(2)],
    )
    email = models.EmailField(
        "E-mail",
        unique=True,
    )

    class Meta:
        db_table = "users"
        ordering = ["name"]
        verbose_name = "Usuário"
        verbose_name_plural = "Usuários"

    def __str__(self) -> str:
        return f"{self.name} <{self.email}>"

class Task(models.Model):
    class Priority(models.TextChoices):
        LOW = "LOW", "Baixa"
        MEDIUM = "MED", "Média"
        HIGH = "HIGH", "Alta"

    class Status(models.TextChoices):
        TODO = "TODO", "A fazer"
        DOING = "DOING", "Fazendo"
        DONE = "DONE", "Pronto"

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="tasks",
        verbose_name="Usuário",
    )
    description = models.CharField(
        "Descrição",
        max_length=255,
        validators=[MinLengthValidator(3)],
    )
    sector_name = models.CharField(
        "Setor",
        max_length=120,
        validators=[MinLengthValidator(2)],
    )
    priority = models.CharField(
        "Prioridade",
        max_length=4,
        choices=Priority.choices,
    )
    created_at = models.DateTimeField(
        "Data de cadastro",
        auto_now_add=True,
        editable=False,
    )
    status = models.CharField(
        "Status",
        max_length=5,
        choices=Status.choices,
        default=Status.TODO,  
    )

    class Meta:
        db_table = "tasks"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status"], name="idx_task_status"),
            models.Index(fields=["priority"], name="idx_task_priority"),
            models.Index(fields=["sector_name"], name="idx_task_sector"),
        ]
        verbose_name = "Tarefa"
        verbose_name_plural = "Tarefas"

    def __str__(self) -> str:
        return f"[{self.get_status_display()}] {self.description}"