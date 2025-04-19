# Printing in Assembly #

Assembly language provides low-level control over system resources, including output to the console.
The method for printing text varies depending on the specific assembly language and target platform.
This guide covers printing in x86 assembly for both DOS and Linux environments.

## DOS (16-bit) ##

For DOS systems, we use the INT 21h interrupt to print characters to the screen.

```nasm
section .data
    message db 'Hello, World!', 0Dh, 0Ah, '$'

section .text
    global _start

_start:
    mov ah, 09h         ; Function to print a string
    mov dx, message     ; Load address of the message
    int 21h             ; Call DOS interrupt

    mov ah, 4Ch         ; Function to exit program
    int 21h             ; Call DOS interrupt
```

In this example:

- The message is defined in the `.data` section, ending with `'$'` as required by DOS.
- Function 09h of INT 21h is used to print the string.
- Function 4Ch of INT 21h is used to exit the program.

## Linux (32-bit) ##

For Linux systems, we use system calls to interact with the operating system for printing.

```nasm
section .data
    message db 'Hello, World!', 0Ah, 0

section .text
    global _start

_start:
    mov eax, 4          ; System call number for sys_write
    mov ebx, 1          ; File descriptor 1 is stdout
    mov ecx, message    ; Address of the message
    mov edx, 14         ; Length of the message
    int 80h             ; Call kernel

    mov eax, 1          ; System call number for sys_exit
    xor ebx, ebx        ; Return 0 status
    int 80h             ; Call kernel
```

In this Linux example:

- System call 4 (sys_write) is used to print the string.
- System call 1 (sys_exit) is used to exit the program.
- The `int 80h` instruction is used to make system calls.

## Printing Individual Characters ##

To print individual characters, you can use a loop. Here's an example for Linux:

```nasm
section .data
    message db 'Hello, World!', 0Ah, 0

section .text
    global _start

_start:
    mov esi, message    ; Load address of the message

print_loop:
    lodsb               ; Load byte from [ESI] into AL and increment ESI
    test al, al         ; Check if it's the null terminator
    jz exit             ; If zero, exit the loop

    push eax            ; Save EAX (contains the character)
    mov eax, 4          ; sys_write system call
    mov ebx, 1          ; stdout file descriptor
    mov ecx, esp        ; Address of the character on the stack
    mov edx, 1          ; Length is 1 byte
    int 80h             ; Call kernel
    pop eax             ; Restore EAX

    jmp print_loop      ; Continue loop

exit:
    mov eax, 1          ; sys_exit system call
    xor ebx, ebx        ; Return 0 status
    int 80h             ; Call kernel
```

This example demonstrates printing each character individually, which can be useful for more complex output scenarios.

Remember to assemble and link your code appropriately for your target platform.
The exact commands may vary depending on your assembler and operating system.
