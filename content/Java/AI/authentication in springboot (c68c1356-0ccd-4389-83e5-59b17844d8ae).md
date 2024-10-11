# Authentication in Spring Boot #

Spring Boot provides robust support for implementing authentication in your applications. This guide covers the basics of setting up authentication using Spring Security, including user details configuration and basic auth.

## Setting up Spring Security ##

1. Add the Spring Security dependency to your `pom.xml`:

   ```xml
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-security</artifactId>
   </dependency>
   ```

2. Create a basic security configuration:

   ```java
   @Configuration
   @EnableWebSecurity
   public class SecurityConfig extends WebSecurityConfigurerAdapter {

       @Override
       protected void configure(HttpSecurity http) throws Exception {
           http
               .authorizeRequests()
                   .anyRequest().authenticated()
               .and()
               .httpBasic();
       }

       @Autowired
       public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
           auth
               .inMemoryAuthentication()
                   .withUser("user").password("{noop}password").roles("USER");
       }
   }
   ```

## Customizing User Details ##

3. Implement a custom `UserDetailsService`:

   ```java
   @Service
   public class CustomUserDetailsService implements UserDetailsService {

       @Autowired
       private UserRepository userRepository;

       @Override
       public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
           User user = userRepository.findByUsername(username)
               .orElseThrow(() -> new UsernameNotFoundException("User not found"));

           return new org.springframework.security.core.userdetails.User(
               user.getUsername(),
               user.getPassword(),
               user.getRoles().stream()
                   .map(role -> new SimpleGrantedAuthority(role.getName()))
                   .collect(Collectors.toList())
           );
       }
   }
   ```

4. Update the security configuration to use the custom `UserDetailsService`:

   ```java
   @Configuration
   @EnableWebSecurity
   public class SecurityConfig extends WebSecurityConfigurerAdapter {

       @Autowired
       private CustomUserDetailsService userDetailsService;

       @Override
       protected void configure(AuthenticationManagerBuilder auth) throws Exception {
           auth.userDetailsService(userDetailsService)
               .passwordEncoder(passwordEncoder());
       }

       @Bean
       public PasswordEncoder passwordEncoder() {
           return new BCryptPasswordEncoder();
       }

       // ... other configurations
   }
   ```

## Implementing JWT Authentication ##

5. Add JWT dependencies to your `pom.xml`:

   ```xml
   <dependency>
       <groupId>io.jsonwebtoken</groupId>
       <artifactId>jjwt-api</artifactId>
       <version>0.11.2</version>
   </dependency>
   <dependency>
       <groupId>io.jsonwebtoken</groupId>
       <artifactId>jjwt-impl</artifactId>
       <version>0.11.2</version>
       <scope>runtime</scope>
   </dependency>
   ```

6. Create a `JwtUtil` class for token generation and validation:

   ```java
   @Component
   public class JwtUtil {

       @Value("${jwt.secret}")
       private String secret;

       @Value("${jwt.expiration}")
       private Long expiration;

       public String generateToken(UserDetails userDetails) {
           Map<String, Object> claims = new HashMap<>();
           return createToken(claims, userDetails.getUsername());
       }

       private String createToken(Map<String, Object> claims, String subject) {
           return Jwts.builder()
               .setClaims(claims)
               .setSubject(subject)
               .setIssuedAt(new Date(System.currentTimeMillis()))
               .setExpiration(new Date(System.currentTimeMillis() + expiration * 1000))
               .signWith(SignatureAlgorithm.HS256, secret)
               .compact();
       }

       // ... methods for token validation
   }
   ```

7. Implement a `JwtRequestFilter` to intercept and process JWT tokens:

   ```java
   @Component
   public class JwtRequestFilter extends OncePerRequestFilter {

       @Autowired
       private CustomUserDetailsService userDetailsService;

       @Autowired
       private JwtUtil jwtUtil;

       @Override
       protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
               throws ServletException, IOException {

           final String authorizationHeader = request.getHeader("Authorization");

           String username = null;
           String jwt = null;

           if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
               jwt = authorizationHeader.substring(7);
               username = jwtUtil.extractUsername(jwt);
           }

           if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
               UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

               if (jwtUtil.validateToken(jwt, userDetails)) {
                   UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                       userDetails, null, userDetails.getAuthorities());
                   authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                   SecurityContextHolder.getContext().setAuthentication(authToken);
               }
           }
           chain.doFilter(request, response);
       }
   }
   ```

These steps provide a solid foundation for implementing authentication in your Spring Boot application, covering basic auth, custom user details, and JWT-based authentication.
