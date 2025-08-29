<?php

// src/Entity/Expense.php

namespace App\Entity;

use App\Repository\ExpenseRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ExpenseRepository::class)]


class Expense
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;



    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column]
    private ?int $amount = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $date = null;

    #[ORM\ManyToOne(inversedBy: 'expenses')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Category $category = null;

    
    #[ORM\ManyToOne(inversedBy: 'expenses')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;


    #[ORM\Column]
    private ?\DateTimeImmutable $created_at = null;
    #[ORM\Column]
    private ?\DateTimeImmutable $updated_at = null;





    public function __construct()
    {
        $this->created_at = new \DateTimeImmutable();
        $this->updated_at = new \DateTimeImmutable();
    }




    public function getId(): ?int
    {
        return $this->id;
    }





    public function getTitle(): ?string
    {
        return $this->title;
    }





    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }





    public function getAmount(): ?int
    {
        return $this->amount;
    }

    
    
    
    public function setAmount(int $amount): static
    {
        $this->amount = $amount;

        return $this;
    }





    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }



    public function setDate(\DateTimeInterface $date): static
    {
        $this->date = $date;

        return $this;
    }



    public function getCategory(): ?Category
    {
        return $this->category;
    }





    public function setCategory(?Category $category): static
    {
        $this->category = $category;

        return $this;
    }





    public function getUser(): ?User
    {
        return $this->user;
    }




    public function setUser(?User $user): static
    {

        $this->user = $user;
    
        return $this;
    }






    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->created_at;
    }




    public function setCreatedAt(\DateTimeImmutable $created_at): static
    {
        $this->created_at = $created_at;

        return $this;
    }






    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updated_at;
    }






    public function setUpdatedAt(\DateTimeImmutable $updated_at): static
    {
        $this->updated_at = $updated_at;

        return $this;
    }
}
